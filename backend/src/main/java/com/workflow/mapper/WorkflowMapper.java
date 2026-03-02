package com.workflow.mapper;

import com.workflow.dto.WorkflowDto;
import com.workflow.dto.WorkflowStepDto;
import com.workflow.model.Workflow;
import com.workflow.model.WorkflowStep;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WorkflowMapper {
    WorkflowDto toDto(Workflow workflow);
    
    @Mapping(target = "id", ignore = true)
    Workflow toEntity(WorkflowDto dto);

    WorkflowStepDto stepToDto(WorkflowStep step);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workflow", ignore = true)
    WorkflowStep stepToEntity(WorkflowStepDto dto);
}
