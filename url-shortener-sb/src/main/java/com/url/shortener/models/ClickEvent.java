package com.url.shortener.models;


import jakarta.persistence.*;
import lombok.Data;

import javax.annotation.processing.Generated;
import java.time.LocalDateTime;

@Entity
@Data

public class ClickEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime clickDate;

    @ManyToOne
    @JoinColumn(name="url_mapping_id")      //forgein key component ===spring boot ?JPA
    private UrlMapping urlMapping;



}
