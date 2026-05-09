package com.teamtask.manager.service;

import com.teamtask.manager.dto.request.TaskRequest;
import com.teamtask.manager.dto.request.UpdateTaskStatusRequest;
import com.teamtask.manager.dto.response.TaskResponse;
import com.teamtask.manager.exception.BadRequestException;
import com.teamtask.manager.exception.ResourceNotFoundException;
import com.teamtask.manager.exception.UnauthorizedException;
import com.teamtask.manager.model.Project;
import com.teamtask.manager.model.Task;
import com.teamtask.manager.model.User;
import com.teamtask.manager.model.enums.TaskStatus;
import com.teamtask.manager.repository.TaskRepository;
import com.teamtask.manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    @Transactional
    public TaskResponse createTask(Long projectId, TaskRequest request, String creatorEmail) {
        logger.info("Creating task in project {} by user: {}", projectId, creatorEmail);

        Project project = projectService.findProjectEntityById(projectId);
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", creatorEmail));

        // Validate creator is member
        validateMemberAccess(project, creatorEmail);

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssigneeId()));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .priority(request.getPriority() != null ? request.getPriority() :
                        com.teamtask.manager.model.enums.Priority.MEDIUM)
                .status(TaskStatus.TODO)
                .project(project)
                .assignee(assignee)
                .createdBy(creator)
                .build();

        Task savedTask = taskRepository.save(task);
        logger.info("Task created with ID: {}", savedTask.getId());
        return TaskResponse.fromEntity(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProject(Long projectId, String userEmail) {
        Project project = projectService.findProjectEntityById(projectId);
        validateMemberAccess(project, userEmail);

        return taskRepository.findByProject(project).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId, String userEmail) {
        Task task = findTaskEntityById(taskId);
        validateMemberAccess(task.getProject(), userEmail);
        return TaskResponse.fromEntity(task);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, TaskRequest request, String userEmail) {
        Task task = findTaskEntityById(taskId);
        validateMemberAccess(task.getProject(), userEmail);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssigneeId()));
            task.setAssignee(assignee);
        }

        Task updatedTask = taskRepository.save(task);
        logger.info("Task updated: {}", taskId);
        return TaskResponse.fromEntity(updatedTask);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long taskId, UpdateTaskStatusRequest request, String userEmail) {
        Task task = findTaskEntityById(taskId);

        // Only assigned user or admin can update status
        boolean isAssigned = task.getAssignee() != null &&
                task.getAssignee().getEmail().equals(userEmail);
        if (!isAssigned) {
            validateAdminAccess(task.getProject(), userEmail);
        }

        task.setStatus(request.getStatus());
        Task updatedTask = taskRepository.save(task);
        logger.info("Task status updated: {} -> {}", taskId, request.getStatus());
        return TaskResponse.fromEntity(updatedTask);
    }

    @Transactional
    public void deleteTask(Long taskId, String userEmail) {
        Task task = findTaskEntityById(taskId);
        validateAdminAccess(task.getProject(), userEmail);

        taskRepository.delete(task);
        logger.info("Task deleted: {}", taskId);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByAssignee(Long projectId, Long assigneeId, String userEmail) {
        Project project = projectService.findProjectEntityById(projectId);
        validateMemberAccess(project, userEmail);

        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", assigneeId));

        return taskRepository.findByAssigneeAndProject(assignee, project).stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Helper methods
    private Task findTaskEntityById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
    }

    private void validateMemberAccess(Project project, String userEmail) {
        boolean isMember = project.getMembers().stream()
                .anyMatch(member -> member.getUser().getEmail().equals(userEmail));
        if (!isMember) {
            throw new UnauthorizedException("You are not a member of this project");
        }
    }

    private void validateAdminAccess(Project project, String userEmail) {
        boolean isAdmin = project.getMembers().stream()
                .anyMatch(member -> member.getUser().getEmail().equals(userEmail) &&
                        member.getRole() == com.teamtask.manager.model.enums.Role.ADMIN);
        if (!isAdmin) {
            throw new UnauthorizedException("Only project admin can perform this action");
        }
    }
}