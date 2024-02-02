package com.example.demo.Service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
@Service
public class OutputPageService {
    public String createlocalhost() throws IOException, InterruptedException {
        String distpath = "C:\\Users\\immadisetty.deepika\\demo_addition\\dist\\demo_addition\\browser";
        String portcommand = "http-server -p 9000";
        // Build the npm start command
        ProcessBuilder startProcessBuilder = new ProcessBuilder("cmd", "/c", portcommand);
        startProcessBuilder.directory(new File(distpath));
        startProcessBuilder.redirectErrorStream(true);
        // Start the process
        Process startProcess = startProcessBuilder.start();
        // Read the output of the start process
        BufferedReader startReader = new BufferedReader(new InputStreamReader(startProcess.getInputStream()));
        System.out.println("Thread is creating localPort");
        String startLine;
        while ((startLine = startReader.readLine()) != null) {
            if (startLine.contains("http://127.0.0.1:9000")) {
                System.out.println("Angular project hosted successfully.");
                break;
            }
        }
//            int exitcode=startProcess.waitFor();
        System.out.println("Thread created localPort Successfully" );
        Thread.sleep(3000);
        startProcess.destroyForcibly();
        return "http://localhost:9000";
    }
}
