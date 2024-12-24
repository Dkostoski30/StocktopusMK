package mk.finki.ukim.mk.stocktopusbackend.model.dto;

import java.util.Date;

public record LatestNewsDTO(
        Long id,
        Date date,
        String text,
        String sentiment
) {}