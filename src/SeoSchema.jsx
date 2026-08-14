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
                "url": `https://veerexa.com/#${software.id}`,
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "INR"
                }
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default SeoSchema;
