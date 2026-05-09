package com.teamtask.manager.controller;

import com.teamtask.manager.dto.request.TaskRequest;
import com.teamtask.manager.dto.request.UpdateTaskStatusRequest;
import com.teamtask.manager.dto.response.TaskResponse;
import com.teamtask.manager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to create task in project: {}", projectId);
        TaskResponse task = taskService.createTask(projectId, request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasksByProject(
            @PathVariable Long projectId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to get tasks for project: {}", projectId);
        List<TaskResponse> tasks = taskService.getTasksByProject(projectId, userEmail);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to get task: {} from project: {}", taskId, projectId);
        TaskResponse task = taskService.getTaskById(taskId, userEmail);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to update task: {} in project: {}", taskId, projectId);
        TaskResponse task = taskService.updateTask(taskId, request, userEmail);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskStatusRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to update task status: {} to {}", taskId, request.getStatus());
        TaskResponse task = taskService.updateTaskStatus(taskId, request, userEmail);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to delete task: {} from project: {}", taskId, projectId);
        taskService.deleteTask(taskId, userEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<TaskResponse>> getTasksByAssignee(
            @PathVariable Long projectId,
            @PathVariable Long assigneeId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to get tasks for assignee: {} in project: {}", assigneeId, projectId);
        List<TaskResponse> tasks = taskService.getTasksByAssignee(projectId, assigneeId, userEmail);
        return ResponseEntity.ok(tasks);
    }
}