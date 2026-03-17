package com.url.shortener.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
   @Autowired
   private JwtUtils jwtTokenProvider;
   @Autowired
   private UserDetailsService userDetailsService; //this is provided to us by spring security

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try{

            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                filterChain.doFilter(request, response);
                return;
            }
            //series of steps that we need to do
            //get jwt from header
            String jwt=jwtTokenProvider.getJwtFromHeader(request);

            if(jwt!=null && jwtTokenProvider.validateToken(jwt)){
                String username=jwtTokenProvider.getUserNamFromJwtToken(jwt);
                 UserDetails userDetails= userDetailsService.loadUserByUsername(username);  //loading userDetails

                if(userDetails !=null){
                  UsernamePasswordAuthenticationToken  authentication =new UsernamePasswordAuthenticationToken
                          (userDetails, null, userDetails.getAuthorities());
                 authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                }
            }
            //validate token//if valid get user details
            //--get username-> load user->set the auth context

        }catch(Exception e){
            e.printStackTrace();

        }
         filterChain.doFilter(request,response);

    }
}


