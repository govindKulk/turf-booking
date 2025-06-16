package com.turfoff.turfbooking.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customConfig() {
        final String securitySchemeName = "bearerAuth";
        return
                new OpenAPI()
                        .info(
                                new Info()
                                        .title("Sports Slot Booking Website")
                                        .description("By Harsh Haria<br>Authorize requests before making API calls.")
                        )
                        .servers(
                                List.of(new Server().url("http://localhost:4000/").description("Live"))
                        )
                        .tags(
                                List.of(new Tag().name("User APIs"), new Tag().name("Turf APIs"))
                        )
                        .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                        .components(
                                new Components()
//                                        .addSecuritySchemes("bearerAuth", new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT").in(SecurityScheme.In.HEADER).name("Authorization"))
                                        .addSecuritySchemes(securitySchemeName,
                                                new SecurityScheme()
                                                        .name(securitySchemeName)
                                                        .type(SecurityScheme.Type.HTTP)
                                                        .scheme("bearer")
                                                        .bearerFormat("JWT")
                                        )
                        );
    }
}
