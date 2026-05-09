package com.teamtask.manager.service;

import com.teamtask.manager.dto.request.AddMemberRequest;
import com.teamtask.manager.dto.request.ProjectRequest;
import com.teamtask.manager.dto.response.ProjectResponse;
import com.teamtask.manager.exception.BadRequestException;
import com.teamtask.manager.exception.ResourceNotFoundException;
import com.teamtask.manager.exception.UnauthorizedException;
import com.teamtask.manager.model.Project;
import com.teamtask.manager.model.ProjectMember;
import com.teamtask.manager.model.User;
import com.teamtask.manager.model.enums.Role;
import com.teamtask.manager.repository.ProjectMemberRepository;
import com.teamtask.manager.repository.ProjectRepository;
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
public class ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, String creatorEmail) {
        logger.info("Creating project: {} by user: {}", request.getName(), creatorEmail);

        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", creatorEmail));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .creator(creator)
                .build();

        Project savedProject = projectRepository.save(project);

        // Add creator as ADMIN member
        ProjectMember member = ProjectMember.builder()
                .user(creator)
                .project(savedProject)
                .role(Role.ADMIN)
                .build();

        projectMemberRepository.save(member);
        savedProject.getMembers().add(member);

        logger.info("Project created successfully with ID: {}", savedProject.getId());
        return ProjectResponse.fromEntity(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getUserProjects(String userEmail) {
        logger.info("Fetching projects for user: {}", userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        return projectRepository.findByMember(user).stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long projectId, String userEmail) {
        Project project = findProjectEntityById(projectId);
        validateUserIsMember(project, userEmail);

        return ProjectResponse.fromEntity(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long projectId, ProjectRequest request, String userEmail) {
        Project project = findProjectEntityById(projectId);
        validateUserIsAdmin(project, userEmail);

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        logger.info("Project updated: {}", projectId);
        return ProjectResponse.fromEntity(updatedProject);
    }

    @Transactional
    public void deleteProject(Long projectId, String userEmail) {
        Project project = findProjectEntityById(projectId);
        validateUserIsAdmin(project, userEmail);

        projectRepository.delete(project);
        logger.info("Project deleted: {}", projectId);
    }

    @Transactional
    public ProjectResponse addMember(Long projectId, AddMemberRequest request, String adminEmail) {
        Project project = findProjectEntityById(projectId);
        validateUserIsAdmin(project, adminEmail);

        User newMember = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        // Check if already a member
        if (projectMemberRepository.existsByUserAndProject(newMember, project)) {
            throw new BadRequestException("User is already a member of this project");
        }

        ProjectMember member = ProjectMember.builder()
                .user(newMember)
                .project(project)
                .role(Role.MEMBER)
                .build();

        projectMemberRepository.save(member);
        project.getMembers().add(member);

        logger.info("Member added to project {}: {}", projectId, newMember.getEmail());
        return ProjectResponse.fromEntity(project);
    }

    @Transactional
    public ProjectResponse removeMember(Long projectId, Long memberId, String adminEmail) {
        Project project = findProjectEntityById(projectId);
        validateUserIsAdmin(project, adminEmail);

        User memberToRemove = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", memberId));

        // Cannot remove the creator
        if (memberToRemove.getId().equals(project.getCreator().getId())) {
            throw new BadRequestException("Cannot remove the project creator from the project");
        }

        projectMemberRepository.deleteByUserAndProject(memberToRemove, project);
        logger.info("Member removed from project {}: {}", projectId, memberId);

        return ProjectResponse.fromEntity(project);
    }

    // Helper methods
    public Project findProjectEntityById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
    }

    private void validateUserIsMember(Project project, String userEmail) {
        boolean isMember = project.getMembers().stream()
                .anyMatch(member -> member.getUser().getEmail().equals(userEmail));
        if (!isMember) {
            throw new UnauthorizedException("You are not a member of this project");
        }
    }

    private void validateUserIsAdmin(Project project, String userEmail) {
        ProjectMember member = project.getMembers().stream()
                .filter(m -> m.getUser().getEmail().equals(userEmail))
                .findFirst()
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this project"));

        if (member.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only project admin can perform this action");
        }
    }
}