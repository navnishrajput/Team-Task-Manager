package com.teamtask.manager.controller;

import com.teamtask.manager.dto.request.AddMemberRequest;
import com.teamtask.manager.dto.request.ProjectRequest;
import com.teamtask.manager.dto.response.ProjectResponse;
import com.teamtask.manager.service.ProjectService;
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
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);
    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to create project: {} by user: {}", request.getName(), userEmail);
        ProjectResponse project = projectService.createProject(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getUserProjects(Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to get projects for user: {}", userEmail);
        List<ProjectResponse> projects = projectService.getUserProjects(userEmail);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable Long projectId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to get project: {}", projectId);
        ProjectResponse project = projectService.getProjectById(projectId, userEmail);
        return ResponseEntity.ok(project);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to update project: {}", projectId);
        ProjectResponse project = projectService.updateProject(projectId, request, userEmail);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to delete project: {}", projectId);
        projectService.deleteProject(projectId, userEmail);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectResponse> addMember(
            @PathVariable Long projectId,
            @Valid @RequestBody AddMemberRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to add member to project: {}", projectId);
        ProjectResponse project = projectService.addMember(projectId, request, userEmail);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{projectId}/members/{memberId}")
    public ResponseEntity<ProjectResponse> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long memberId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to remove member {} from project: {}", memberId, projectId);
        ProjectResponse project = projectService.removeMember(projectId, memberId, userEmail);
        return ResponseEntity.ok(project);
    }
}