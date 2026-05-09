package com.teamtask.manager.repository;

import com.teamtask.manager.model.Project;
import com.teamtask.manager.model.ProjectMember;
import com.teamtask.manager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    Optional<ProjectMember> findByUserAndProject(User user, Project project);

    boolean existsByUserAndProject(User user, Project project);

    void deleteByUserAndProject(User user, Project project);
}