package com.example.taskapi.service;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.*;
import io.kubernetes.client.util.Config;
import java.util.Arrays;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class KubernetesService {

    private final CoreV1Api api;

    public KubernetesService() throws Exception {
        // Use default configuration (kubeconfig or in-cluster config)
        ApiClient client = Config.defaultClient();
        Configuration.setDefaultApiClient(client);
        this.api = new CoreV1Api();
    }

    public String runCommandInPod(String command) throws Exception {
        String podName = "task-exec-" + UUID.randomUUID().toString().substring(0, 5);
        V1Pod pod = new V1Pod()
            .metadata(new V1ObjectMeta().name(podName))
            .spec(new V1PodSpec()
                .containers(Arrays.asList(new V1Container()
                    .name("task-container")
                    .image("busybox")
                    .command(Arrays.asList("sh", "-c", command))
                ))
                .restartPolicy("Never")
            );
        api.createNamespacedPod("default", pod, null, null, null, null);
        // For testing, return a dummy output.
        return "Dummy output for command: " + command;
    }
    
}
