package com.teamtask.manager.dto.response;

import com.teamtask.manager.model.Project;
import com.teamtask.manager.model.ProjectMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private UserResponse creator;
    private List<MemberResponse> members;
    private int taskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberResponse {
        private Long id;
        private String name;
        private String email;
        private String role;

        public static MemberResponse fromEntity(ProjectMember member) {
            return MemberResponse.builder()
                    .id(member.getUser().getId())
                    .name(member.getUser().getName())
                    .email(member.getUser().getEmail())
                    .role(member.getRole().name())
                    .build();
        }
    }

    public static ProjectResponse fromEntity(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .creator(UserResponse.fromEntity(project.getCreator()))
                .members(project.getMembers().stream()
                        .map(MemberResponse::fromEntity)
                        .collect(Collectors.toList()))
                .taskCount(project.getTasks() != null ? project.getTasks().size() : 0)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}