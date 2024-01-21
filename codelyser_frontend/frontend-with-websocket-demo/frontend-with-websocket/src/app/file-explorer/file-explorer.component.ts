// file-explorer.component.ts

import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { HttpClient } from '@angular/common/http';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { FetchedDataService } from '../fetched-data.service';
import { SharedDataService } from '../shared-data.service';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { log } from 'console';


// interface for files in file explorer
interface TreeNode {
  parent: null;
  name: string;
  children?: TreeNode[];
  path?: string; // Assuming filePath is the property that holds the path of the file
  // Add the isFile property
  isFile?: boolean; 

  color?: string;   // on clicking change color
 
}


const DEFAULT_CODE_MAP: { [key: string]: string } = {
  'html': '<!DOCTYPE html>\n<html>\n<head>\n  <title></title>\n</head>\n<body>\n\n</body>\n</html>',
  'css': '/* Add your CSS code here */',
  'js': '// Add your JavaScript code here',
  'ts': '// Add your TypeScript code here',
  'json': '// Add your Json code here'
  // Add more extensions as needed
};

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit {

  private apiUrl = 'http://localhost:8081/api/project-structure';
  path: string = '';
  currentFileName: string ='';

  @Output() closeEditorClicked = new EventEmitter<void>();

  @ViewChild(MonacoEditorComponent) monacoEditor!: MonacoEditorComponent;

  opened = false;
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>(); 





  constructor(private fetchedDataService: FetchedDataService, private http: HttpClient, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.fetchProjectStructure();
  }

  fetchProjectStructure() {
    this.http.get<TreeNode[]>(this.apiUrl).subscribe(
      (data) => {
        console.log('API Response:', data);
        this.dataSource.data = this.buildTree(data);
      },
      (error) => {
        console.error('Error fetching project structure:', error);
      }
    );
  }
  
  buildTree(data: TreeNode[]): TreeNode[] {
    const tree: TreeNode[] = [];
  
    data.forEach((node) => {
      this.addNodeToTree(tree, node.name.split('/'), node.children);
    });
  
    console.log('Built Tree:', tree);
    return tree;
  }
  
  private addNodeToTree(tree: TreeNode[], pathParts: string[], children?: TreeNode[]): void {
    let currentLevel: TreeNode[] = tree;
  
    pathParts.forEach((part, index) => {
      const existingNode = currentLevel.find((n) => n.name === part);
  
      if (existingNode) {
        // If the node already exists, update the current level to its children
        currentLevel = existingNode.children || [];
      } else {
        // If the node doesn't exist, create a new node and add it to the current level
        const newNode: TreeNode = {
          name: part,

          children: index === pathParts.length - 1 ? children || [] : [],
          parent: null
        };
        currentLevel.push(newNode);
  
        // Update the current level to the new node's children
        currentLevel = newNode.children || [];
      }
    });
  }
  

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;



  selectedNode: TreeNode | null = null; // Track the selected node


findParent(node: TreeNode): TreeNode | null {
  return node.parent ? node.parent : null;
}

isLeafNode(node: TreeNode): boolean {
  return !node.children || node.children.length === 0;
}

onNodeClick(node: TreeNode): void {
  const path = this.getNodePath(node, this.dataSource.data);

  const fileExtension = this.getFileExtension(node.name);

  const language = this.getLanguageForExtension(fileExtension);
  console.log("l "+language);
  if (this.isLeafNode(node)) {
    // node.color = 'grey';

    //show file name in editor
    this.currentFileName = node.name; 
    this.fetchedDataService.getFileContent(path).pipe(
      // Use the map operator to transform the response to a string
      map((response: any) => {
        if (typeof response === 'object') {
          // Convert the object to a JSON string
          return JSON.stringify(response);
        } else {
          // If the response is already a string, return it as is
          return response;
        }
      })
    ).subscribe(
      (response) => {
        console.log('File Content:', response);
        try {
          // Parse the response as JSON
          const parsedResponse = JSON.parse(response);
  
          // Check if parsedResponse is an object
          if (typeof parsedResponse === 'object') {
            // Find the first value in the object
            const fileContent = Object.values(parsedResponse)[0];
            console.log(fileContent);
            // Check if the value is a string
            if (typeof fileContent === 'string') {
              // Update the file content using the method in MonacoComponent
              this.monacoEditor.setEditorContent(fileContent, language);
            } else {
              console.error('Invalid file content format:', fileContent);
            }
          } else {
            console.error('Invalid JSON format:', response);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
    // If the selected node is a file, call getFileContent function
    // this.fetchedDataService.getFileContent(path).subscribe(
    //   (response) => {
    //     console.log('File Content:', response);
    //     try {
    //       // Parse the JSON string
    //       const parsedResponse = JSON.parse(response);
  
    //       // Check if parsedResponse is an object
    //       if (typeof parsedResponse === 'object') {
    //         // Find the first value in the object
    //         const fileContent = Object.values(parsedResponse)[0];
    //         console.log(fileContent);
    //         // Check if the value is a string
    //         if (typeof fileContent === 'string') {
    //           // Update the file content using the method in MonacoComponent
    //           this.monacoEditor.setEditorContent(fileContent, language);
    //         } else {
    //           console.error('Invalid file content format:', fileContent);
    //         }
    //       } else {
    //         console.error('Invalid JSON format:', response);
    //       }
    //     } catch (error) {
    //       console.error('Error parsing JSON:', error);
    //     }
        // Assuming 'response' contains the file content as a string
        // const fileContent = response;

        // // Update the file content using the method in MonacoComponent
        // this.monacoEditor.setEditorContent(fileContent, language);
      },
      (error) => {
        console.error('Error fetching file content:', error);
      }
    );
  } else {
    console.log('Selected Node is not a file or does not have a filePath.');
  }

  console.log('Clicked Node Path:', path);
}

getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

getLanguageForExtension(fileExtension: string): string {
  // Add logic to map file extensions to Monaco Editor language modes
  switch (fileExtension) {

    case 'md':
      return 'md';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'json':
      return 'Json';
    default:
      return 'plaintext'; // Default to plaintext if no specific language is defined
  }
}

 private editor: any;

// Function to get the path of a clicked node
getNodePath(targetNode: TreeNode, nodes: TreeNode[]): string {
  const path: string[] = [];

  const findPath = (currentNode: TreeNode, currentPath: string[]) => {
    if (currentNode === targetNode) {
      path.push(...currentPath);
      return true;
    }

    if (currentNode.children) {
      for (const childNode of currentNode.children) {
        const newPath = [...currentPath, childNode.name];
        if (findPath(childNode, newPath)) {
          return true;
        }
      }
    }

    return false;
  };

  for (const rootNode of nodes) {
    if (findPath(rootNode, [rootNode.name])) {
      break;
    }
  }

  return path.join('/');
}


//editor file close
// closeEditor(): void {
//   // Implement logic to close the editor
//   //this.currentFileName = ''; // Reset the current file name
//   this.closeEditorClicked.emit();
//   // You might want to reset the content of the editor or take any other actions necessary
// }
}

