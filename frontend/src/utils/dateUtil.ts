// 시간까지 가져오는 함수 (YYYY-MM-DDTHH:MM:SS)
export function getCurrentTimeISO(): string {
    const kstTime = new Date();
    return kstTime.toISOString().split(".")[0]; // "YYYY-MM-DDTHH:MM:SS"
}

// 밀리초까지 가져오는 함수 (YYYY-MM-DDTHH:MM:SS.sss)
export function getCurrentTimeWithMillisecondsISO(): string {
    return new Date().toISOString().slice(0, 23); // "YYYY-MM-DDTHH:MM:SS.sss"
}

// 날짜까지만 가져오는 함수 (YYYY-MM-DD)
export function getCurrentDateISO(): string {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}