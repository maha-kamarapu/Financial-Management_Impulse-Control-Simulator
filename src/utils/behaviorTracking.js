export const trackBehavior = (eventType, eventDetails) => {
    const timestamp = new Date().toISOString();
    const behaviorData = {
        eventType,
        eventDetails,
        timestamp,
    };

    // Send data to the backend for processing
    fetch('/api/track-behavior', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(behaviorData),
    })
        .then(response => response.json())
        .then(data => console.log('Behavior tracked:', data))
        .catch(error => console.error('Error tracking behavior:', error));
};
