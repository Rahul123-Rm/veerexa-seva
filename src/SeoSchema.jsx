import React from 'react';
import { SOFTWARE_LIST } from './data.js';

const SeoSchema = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": SOFTWARE_LIST.map((software, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "SoftwareApplication",
                "name": software.name,
                "description": `Download ${software.name} for ${software.bank} CSP Kiosk. Fast and direct download for RD services, drivers, and banking software.`,
                "operatingSystem": "Windows",
                "applicationCategory": "BusinessApplication",
                "downloadUrl": software.link,
                "softwareVersion": software.version,
                "fileSize": software.size,
                "url": `https://kiosk-software.veerexa.com/#${software.id}`,
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "INR"
                }
            }
        }))
    };

    const ifscSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "IFSC Code Finder - Veerexa",
        "description": "Find IFSC codes, MICR codes, and branch details for all banks in India. Search by state, city, and branch.",
        "url": "https://kiosk-software.veerexa.com/#ifsc",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://kiosk-software.veerexa.com/#ifsc?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ifscSchema) }}
            />
        </>
    );
};

export default SeoSchema;
