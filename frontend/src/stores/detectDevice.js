export function getClientDescription() {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    // Detect Browser
    let browser = "Unknown";
    if (ua.includes("edg")) browser = "Edge";
    else if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome";
    else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
    else if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("opr") || ua.includes("opera")) browser = "Opera";

    // Detect Device Type
    let device = "Desktop";
    if (/mobi|android|iphone|ipad|tablet/.test(ua)) {
        if (/tablet|ipad/.test(ua)) device = "Tablet";
        else device = "Mobile";
    }

    // Detect OS
    let os = "Unknown";
    if (ua.includes("android")) os = "Android";
    else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";
    else if (platform.includes("win")) os = "Windows";
    else if (platform.includes("mac")) os = "macOS";
    else if (platform.includes("linux")) os = "Linux";

    // Detect Manufacturer (optional)
    let brand = "Unknown Device";
    if (ua.includes("samsung")) brand = "Samsung";
    else if (ua.includes("huawei")) brand = "Huawei";
    else if (ua.includes("xiaomi")) brand = "Xiaomi";
    else if (ua.includes("oppo")) brand = "Oppo";
    else if (ua.includes("vivo")) brand = "Vivo";
    else if (ua.includes("pixel")) brand = "Google Pixel";
    else if (ua.includes("iphone")) brand = "iPhone";
    else if (ua.includes("ipad")) brand = "iPad";

    // Generate Human Readable Description
    const description = `${browser} on ${brand} ${os} ${device}`;

    return {
        browser,
        device,
        os,
        brand,
        description,
        userAgent: navigator.userAgent
    };
}
