package com.example.demo.Service;

import com.example.demo.Repositories.QuestionRepository;
import com.example.demo.models.Workspace;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Component
public class WorkspaceStore {
    @Autowired
    private QuestionRepository questionRepository;

    List<Workspace> allWorkspaces=new ArrayList<Workspace>();

    public void addworkspace(Workspace workspace){
        allWorkspaces.add(workspace);
        System.out.println(allWorkspaces);
    }

    public Workspace getWorkSpaceForQuestionAndCandidate(long candidateId, long questionId) {
        Workspace ws = getFreeWorkspaceForQuestion(questionId);
        assignCandidateToWorkspace(ws, candidateId);

        return ws;
    }
//    public void makeBackUp(int workSpaceNumber,)
//    {
//
//    }

    public void assignCandidateToWorkspace(Workspace workspace, long candidate) {
        workspace.candidateId = candidate;
        workspace.isWorspaceAssigned = true;
        System.out.println(workspace);

    }
    public Workspace makeBackup(Long questionId,Long cloneNumber,String questionName) throws IOException {
        WorkSpaceService workSpaceService = new WorkSpaceService(questionRepository);
        Path clonedFilePath = workSpaceService.makeWorkSpace(questionId, Integer.valueOf(Math.toIntExact(cloneNumber)),questionName);
              System.out.println("in work space store "+clonedFilePath.toString());
        Workspace w=new Workspace(questionId,clonedFilePath,cloneNumber);
        addworkspace(w);
        return  w;
    }
    public void releaseWorkSpace( long candidate) {
        Workspace  workspace = getAssignedWorkspaceForCandidate(candidate);
        allWorkspaces.remove(workspace);
        System.out.println("deleted"+allWorkspaces);
    }

    public Workspace getFreeWorkspaceForQuestion(long questionID) {

        for (Workspace workspace : allWorkspaces) {
            if (workspace.questionId == questionID && !workspace.isWorspaceAssigned) {
                workspace.isWorspaceAssigned = true;
                return workspace;
            }
        }
        return null;
    }

    public Workspace getAssignedWorkspaceForCandidate(long candidateId) {

        for (Workspace workspace : allWorkspaces) {
            if (workspace.candidateId == candidateId) {
                workspace.isWorspaceAssigned = true;
                return workspace;
            }
        }
        return null;
    }
//    public String removeWorkSpace(long userId)
//    {
//        for(Workspace workspace:allWorkspaces)
//        {
//            if(workspace.getCandidateId()==userId)
//            {
//                allWorkspaces.remove(workspace);
//                System.out.println("removed "+allWorkspaces);
//                return "removed work space.....";
//            }
//        }
//        return "work space not found ";
//    }
}
