package com.workflow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workflow_steps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowStep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Workflow workflow;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer stepIndex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role requiredRole;
}
