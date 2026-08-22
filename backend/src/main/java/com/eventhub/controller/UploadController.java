package com.eventhub.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController @RequestMapping("/api/admin/uploads")
public class UploadController {
    private final Path root = Paths.get("data", "uploads");
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty() || file.getSize() > 5_000_000L || file.getContentType() == null || !file.getContentType().startsWith("image/")) throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST, "Upload a valid image under 5 MB");
        Files.createDirectories(root);
        String original = Optional.ofNullable(file.getOriginalFilename()).orElse("image");
        String extension = original.contains(".") ? original.substring(original.lastIndexOf('.')).replaceAll("[^a-zA-Z0-9.]", "") : ".jpg";
        String name = UUID.randomUUID() + extension.toLowerCase(Locale.ROOT);
        Files.copy(file.getInputStream(), root.resolve(name), StandardCopyOption.REPLACE_EXISTING);
        return Map.of("url", "/uploads/" + name);
    }
}
