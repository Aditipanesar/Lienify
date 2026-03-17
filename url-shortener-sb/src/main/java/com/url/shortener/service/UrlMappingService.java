package com.url.shortener.service;

import com.url.shortener.dtos.ClickEventDTO;
import com.url.shortener.dtos.UrlMappingDTO;
import com.url.shortener.models.ClickEvent;
import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import com.url.shortener.repository.ClickEventRepository;
import com.url.shortener.repository.UrlMappingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UrlMappingService {

    private UrlMappingRepository urlMappingRepository;
    private ClickEventRepository clickEventRepository;

    // ── EXISTING: unchanged ──────────────────────────────────────────────
    public UrlMappingDTO createShortUrl(String originalUrl, User user) {
        String shortUrl = generateShortUrl();
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedDate(LocalDateTime.now());
        UrlMapping savedUrlMapping = urlMappingRepository.save(urlMapping);
        return convertToDto(savedUrlMapping);
    }

    private UrlMappingDTO convertToDto(UrlMapping urlMapping) {
        UrlMappingDTO urlMappingDTO = new UrlMappingDTO();
        urlMappingDTO.setId(urlMapping.getId());
        urlMappingDTO.setOriginalUrl(urlMapping.getOriginalUrl());
        urlMappingDTO.setShortUrl(urlMapping.getShortUrl());
        urlMappingDTO.setClickCount(urlMapping.getClickCount());
        urlMappingDTO.setCreatedDate(urlMapping.getCreatedDate());
        urlMappingDTO.setUsername(urlMapping.getUser().getUsername());
        return urlMappingDTO;
    }

    private String generateShortUrl() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder shortUrl = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            shortUrl.append(characters.charAt(random.nextInt(characters.length())));
        }
        return shortUrl.toString();
    }

    public List<UrlMappingDTO> getUrlsByUser(User user) {
        return urlMappingRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<ClickEventDTO> getClickEventsByDate(String shortUrl, LocalDateTime start, LocalDateTime end) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            return clickEventRepository.findByUrlMappingAndClickDateBetween(urlMapping, start, end).stream()
                    .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()))
                    .entrySet().stream()
                    .map(entry -> {
                        ClickEventDTO clickEventDTO = new ClickEventDTO();
                        clickEventDTO.setClickDate(entry.getKey());
                        clickEventDTO.setCount(entry.getValue());
                        return clickEventDTO;
                    })
                    .collect(Collectors.toList());
        }
        return null;
    }

    public Map<LocalDate, Long> getTotalClicksByUserAndDate(User user, LocalDate start, LocalDate end) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        System.out.println("URLS SIZE: " + urlMappings.size());
        List<ClickEvent> clickEvents = clickEventRepository.findByUrlMappingInAndClickDateBetween(
                urlMappings, start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        System.out.println("CLICKS SIZE: " + clickEvents.size());
        return clickEvents.stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()));
    }

    public UrlMapping getOriginalUrl(String shortUrl) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            urlMapping.setClickCount(urlMapping.getClickCount() + 1);
            urlMappingRepository.save(urlMapping);
            ClickEvent clickEvent = new ClickEvent();
            clickEvent.setClickDate(LocalDateTime.now());
            clickEvent.setUrlMapping(urlMapping);
            clickEventRepository.save(clickEvent);
        }
        return urlMapping;
    }

    // ── NEW: generate 3 readable slug suggestions (NOT saved yet) ────────
    public List<String> generateSlugSuggestions(String originalUrl) {
        List<String> keywords = extractKeywords(originalUrl);
        Set<String> suggestions = new LinkedHashSet<>();
        Random random = new Random();
        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";

        // Try up to 10 attempts to get 3 unique slugs
        int attempts = 0;
        while (suggestions.size() < 3 && attempts < 10) {
            // Pick a keyword (cycle through available ones)
            String keyword = keywords.get(attempts % keywords.size());

            // Generate a 3-char random suffix
            StringBuilder suffix = new StringBuilder(3);
            for (int i = 0; i < 3; i++) {
                suffix.append(chars.charAt(random.nextInt(chars.length())));
            }

            String slug = keyword + "-" + suffix;

            // Only add if not already in DB
            if (urlMappingRepository.findByShortUrl(slug) == null) {
                suggestions.add(slug);
            }
            attempts++;
        }

        // Fallback: if we still don't have 3, add random 8-char slugs
        while (suggestions.size() < 3) {
            String fallback = generateShortUrl();
            if (urlMappingRepository.findByShortUrl(fallback) == null) {
                suggestions.add(fallback);
            }
        }

        return new ArrayList<>(suggestions);
    }

    // ── NEW: save the user-selected slug ─────────────────────────────────
    public UrlMappingDTO createShortUrlWithSlug(String originalUrl, String selectedSlug, User user) {
        // Double-check uniqueness at save time
        if (urlMappingRepository.findByShortUrl(selectedSlug) != null) {
            // Slug was taken between suggest and select — fall back to random
            selectedSlug = generateShortUrl();
        }
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(selectedSlug);
        urlMapping.setUser(user);
        urlMapping.setCreatedDate(LocalDateTime.now());
        UrlMapping savedUrlMapping = urlMappingRepository.save(urlMapping);
        return convertToDto(savedUrlMapping);
    }

    // ── PRIVATE: extract meaningful keywords from a URL ──────────────────
    private List<String> extractKeywords(String originalUrl) {
        List<String> keywords = new ArrayList<>();
        try {
            // Ensure URL has a scheme for parsing
            String urlToParse = originalUrl.startsWith("http") ? originalUrl : "https://" + originalUrl;
            URI uri = new URI(urlToParse);

            // 1. Domain keyword (e.g. "youtube" from youtube.com)
            String host = uri.getHost();
            if (host != null) {
                String domain = host.replace("www.", "");
                String domainName = domain.contains(".") ? domain.split("\\.")[0] : domain;
                if (domainName.length() >= 3) {
                    keywords.add(domainName.toLowerCase().replaceAll("[^a-z0-9]", ""));
                }
            }

            // 2. Path segments (e.g. "watch", "product", "iphone")
            String path = uri.getPath();
            if (path != null && !path.isEmpty()) {
                String[] segments = path.split("/");
                for (String segment : segments) {
                    // Clean segment — remove query params, file extensions
                    String clean = segment.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
                    if (clean.length() >= 3 && clean.length() <= 12
                            && !clean.equals("www") && !clean.equals("com")
                            && !clean.equals("http") && !clean.equals("https")) {
                        keywords.add(clean);
                        if (keywords.size() >= 4) break;
                    }
                }
            }

            // 3. Query param values (e.g. "iphone" from ?q=iphone)
            String query = uri.getQuery();
            if (query != null) {
                for (String param : query.split("&")) {
                    if (param.contains("=")) {
                        String value = param.split("=")[1].replaceAll("[^a-zA-Z]", "").toLowerCase();
                        if (value.length() >= 3 && value.length() <= 12) {
                            keywords.add(value);
                            break;
                        }
                    }
                }
            }

        } catch (Exception e) {
            // If URL parsing fails, use generic keywords
        }

        // Always ensure at least 3 keywords (pad with "link", "url", "go")
        if (keywords.isEmpty()) keywords.add("link");
        if (keywords.size() < 2) keywords.add("url");
        if (keywords.size() < 3) keywords.add("go");

        return keywords;
    }
}
