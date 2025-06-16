package com.turfoff.turfbooking.jwt;

import com.turfoff.turfbooking.services.CombinedUserDetailsService;
import com.turfoff.turfbooking.services.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class UserAuthTokenFilter extends OncePerRequestFilter {

    // List of URLs that should skip JWT authentication
    private static final List<String> EXCLUDED_URLS = Arrays.asList(
            "/users/new",
            "/users/signin",
            "/users/serveralive",
            "/admin/new",
            "/admin/signin",
            "/swagger-ui",
            "/v3/api-docs"
    );

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private CombinedUserDetailsService userDetailsService;

    private String parseJwt(HttpServletRequest request) {
        return jwtUtils.getJwtFromHeader(request);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Request Method: " + request.getMethod());

        String requestPath = request.getRequestURI();

        // Skip JWT processing for excluded URLs
        if (shouldSkipFilter(requestPath)) {
            System.out.println("Skipping JWT filter for: " + requestPath);
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("Processing JWT for: " + requestPath);

        try {
            String jwt = parseJwt(request);
            System.out.println(request.getHeader("Authorization"));
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUsernameFromJwtToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            System.out.println("JWT processing error: " + e.getMessage());
            // Don't return here - let the request continue even if JWT processing fails
        }

        filterChain.doFilter(request, response);
    }

    private boolean shouldSkipFilter(String requestPath) {
        return EXCLUDED_URLS.stream().anyMatch(url -> {
            // Handle wildcard patterns like /swagger-ui/**
            if (url.endsWith("/**")) {
                String basePath = url.substring(0, url.length() - 3);
                return requestPath.startsWith(basePath);
            }
            // Handle exact matches
            return requestPath.equals(url);
        });
    }
}
