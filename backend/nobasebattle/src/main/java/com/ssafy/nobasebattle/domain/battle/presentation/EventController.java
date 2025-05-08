package com.ssafy.nobasebattle.domain.battle.presentation;

import com.ssafy.nobasebattle.domain.battle.presentation.dto.request.CreateEventRequest;
import com.ssafy.nobasebattle.domain.battle.presentation.dto.response.EventResponse;
import com.ssafy.nobasebattle.domain.battle.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/events")
@RestController
public class EventController {

    private final EventService eventService;

    @GetMapping("/latest")
    public EventResponse getLatestEvent() {
        return eventService.getLatestEvent();
    }

    @PostMapping
    public EventResponse createEvent(@RequestBody CreateEventRequest request) {
        return eventService.createEvent(request);
    }

}
