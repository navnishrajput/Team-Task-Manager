package com.teamtask.manager.service;

import com.teamtask.manager.dto.response.DashboardResponse;
import com.teamtask.manager.dto.response.TaskResponse;
import com.teamtask.manager.exception.ResourceNotFoundException;
import com.teamtask.manager.model.Project;
import com.teamtask.manager.model.Task;
import com.teamtask.manager.model.User;
import com.teamtask.manager.model.enums.TaskStatus;
import com.teamtask.manager.repository.ProjectRepository;
import com.teamtask.manager.repository.TaskRepository;
import com.teamtask.manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboardStats(Long projectId, String userEmail) {
        logger.info("Fetching dashboard stats for project: {}", projectId);

        Project project = projectService.findProjectEntityById(projectId);

        // Get all tasks for the project
        List<Task> allTasks = taskRepository.findByProject(project);

        // Count by status
        long todoCount = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.TODO).count();
        long inProgressCount = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long doneCount = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE).count();

        // Overdue tasks
        List<Task> overdueTasks = taskRepository.findOverdueTasksByProject(project, LocalDate.now());
        long overdueCount = overdueTasks.size();

        // Tasks per user
        Map<String, Long> tasksPerUser = new HashMap<>();
        for (Task task : allTasks) {
            if (task.getAssignee() != null) {
                String userName = task.getAssignee().getName();
                tasksPerUser.put(userName, tasksPerUser.getOrDefault(userName, 0L) + 1);
            }
        }

        // Recent tasks (last 10 updated)
        List<TaskResponse> recentTasks = allTasks.stream()
                .sorted((t1, t2) -> t2.getUpdatedAt().compareTo(t1.getUpdatedAt()))
                .limit(10)
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());

        // Overdue task list
        List<TaskResponse> overdueTaskList = overdueTasks.stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());

        logger.info("Dashboard stats - Total: {}, Todo: {}, InProgress: {}, Done: {}, Overdue: {}",
                allTasks.size(), todoCount, inProgressCount, doneCount, overdueCount);

        return DashboardResponse.builder()
                .totalTasks(allTasks.size())
                .todoTasks(todoCount)
                .inProgressTasks(inProgressCount)
                .doneTasks(doneCount)
                .overdueTasks(overdueCount)
                .tasksPerUser(tasksPerUser)
                .recentTasks(recentTasks)
                .overdueTaskList(overdueTaskList)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardResponse getUserDashboardStats(String userEmail) {
        logger.info("Fetching personal dashboard for user: {}", userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        // Get tasks assigned to this user
        List<Task> assignedTasks = taskRepository.findByAssignee(user);

        long todoCount = assignedTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.TODO).count();
        long inProgressCount = assignedTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long doneCount = assignedTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE).count();

        // Overdue tasks for this user
        List<Task> overdueTasks = assignedTasks.stream()
                .filter(t -> t.getDueDate() != null
                        && t.getDueDate().isBefore(LocalDate.now())
                        && t.getStatus() != TaskStatus.DONE)
                .collect(Collectors.toList());

        List<TaskResponse> recentTasks = assignedTasks.stream()
                .sorted((t1, t2) -> t2.getUpdatedAt().compareTo(t1.getUpdatedAt()))
                .limit(10)
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalTasks(assignedTasks.size())
                .todoTasks(todoCount)
                .inProgressTasks(inProgressCount)
                .doneTasks(doneCount)
                .overdueTasks(overdueTasks.size())
                .recentTasks(recentTasks)
                .overdueTaskList(overdueTasks.stream()
                        .map(TaskResponse::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}