package com.workflow.mapper;

import com.workflow.dto.RequestApprovalDto;
import com.workflow.dto.WorkflowRequestDto;
import com.workflow.model.RequestApproval;
import com.workflow.model.WorkflowRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {WorkflowMapper.class})
public interface WorkflowRequestMapper {

    @Mapping(source = "requester.id", target = "requesterId")
    @Mapping(source = "requester.name", target = "requesterName")
    WorkflowRequestDto toDto(WorkflowRequest request);

    @Mapping(source = "request.id", target = "requestId")
    @Mapping(source = "step.id", target = "stepId")
    @Mapping(source = "approver.id", target = "approverId")
    @Mapping(source = "approver.name", target = "approverName")
    RequestApprovalDto toDto(RequestApproval approval);
}
