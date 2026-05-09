package com.teamtask.manager.repository;

import com.teamtask.manager.model.Project;
import com.teamtask.manager.model.Task;
import com.teamtask.manager.model.User;
import com.teamtask.manager.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Tasks by project
    List<Task> findByProject(Project project);

    // Tasks by project and status
    List<Task> findByProjectAndStatus(Project project, TaskStatus status);

    // Tasks assigned to a user
    List<Task> findByAssignee(User assignee);

    // Tasks assigned to user in a specific project
    List<Task> findByAssigneeAndProject(User assignee, Project project);

    // Overdue tasks (due date passed and status not DONE)
    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status <> 'DONE'")
    List<Task> findOverdueTasks(@Param("today") LocalDate today);

    // Overdue tasks in a project
    @Query("SELECT t FROM Task t WHERE t.project = :project AND t.dueDate < :today AND t.status <> 'DONE'")
    List<Task> findOverdueTasksByProject(@Param("project") Project project, @Param("today") LocalDate today);

    // Count tasks by status for a project
    long countByProjectAndStatus(Project project, TaskStatus status);

    // Count all tasks by project
    long countByProject(Project project);

    // Count tasks by assignee
    long countByAssignee(User assignee);
}