package com.ssafy.nobasebattle.domain.battle.service;

import com.ssafy.nobasebattle.domain.battle.domain.Event;
import com.ssafy.nobasebattle.domain.battle.domain.repository.EventRepository;
import com.ssafy.nobasebattle.domain.battle.exception.EventNotFoundException;
import com.ssafy.nobasebattle.domain.battle.presentation.dto.request.CreateEventRequest;
import com.ssafy.nobasebattle.domain.battle.presentation.dto.response.EventResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventResponse getLatestEvent() {

        Event event = eventRepository.findTopByOrderByCreatedAtDesc()
                .orElseThrow(() -> EventNotFoundException.EXCEPTION);
        return new EventResponse(event);
    }

    public EventResponse createEvent(CreateEventRequest eventRequest) {

        validateEventRequest(eventRequest);

        Event event = makeEvent(eventRequest);

        Event savedEvent = eventRepository.save(event);

        return new EventResponse(savedEvent);
    }

    private Event makeEvent(CreateEventRequest eventRequest) {

        return Event.builder()
                .text(eventRequest.getText())
                .imageUrl(eventRequest.getImageUrl())
                .startTime(eventRequest.getStartTime())
                .endTime(eventRequest.getEndTime())
                .build();
    }

    private void validateEventRequest(CreateEventRequest request) {
        if (request.getText() == null || request.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("이벤트 텍스트는 필수 입력 항목입니다.");
        }

        if (request.getStartTime() == null) {
            throw new IllegalArgumentException("이벤트 시작 시간은 필수 입력 항목입니다.");
        }

        if (request.getEndTime() == null) {
            throw new IllegalArgumentException("이벤트 종료 시간은 필수 입력 항목입니다.");
        }

        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new IllegalArgumentException("이벤트 시작 시간은 종료 시간보다 이전이어야 합니다.");
        }
    }

}
