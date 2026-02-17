package uk.ac.rhul.teamprojects36.backend.config;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;


/**
 * Cross-origin resource sharing configuration.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
  
  /**
   * Http security.
   *
   * @param http local-host web-page
   * @return built local-host
   * @throws Exception Unknown exception
   */
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable()).authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll().requestMatchers(HttpMethod.GET, "/api/menu").permitAll().requestMatchers(HttpMethod.PATCH, "/api/menu/*/avaliability").hasAnyRole("STAFF", "ADMIN").anyRequest().authenticated());
    
    return http.build();
  }
  /**
   * Allows password encoding for hashing and validating passwords
   * 
   * @return a PasswordEncoder using BCrypt encoding
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
  
  /**
   * Allows front-end to access back-end.
   *
   * @return CORS source
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(Arrays.asList("*"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"));
    config.setAllowCredentials(false);
    //config.applyPermitDefaultValues();

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return source;
  }
  
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception{
    return authConfig.getAuthenticationManager();
  }
}
