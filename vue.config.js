module.exports = {
    pwa: {
        themeColor: "#4c1d95",
        msTileColor: "#4c1d95",
        name: "Gaf Kiosk",
        start_url: "https://cinesparaguay.adro.studio/",
        display: "standalone",
        description: "Emoji ready to copy and paste! Type emoji on your keyboard. List of all emoji, just type some words to get emoji. Laughing crying emoji 😂⌨",
        orientation: "portrait",
        manifestOptions: {
            icons: [{
                    src: "img/pwa/manifest-icon-192.maskable.png",
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "any"
                },
                {
                    src: "img/pwa/manifest-icon-192.maskable.png",
                    sizes: "192x192",
                    types: "image/png",
                    purposes: "maskable"
                },
                {
                    src: "img/pwa/manifest-icon-512.maskable.png",
                    sizes: "512x512",
                    types: "image/png",
                    purposes: "any"
                },
                {
                    src: "img/pwa/manifest-icon-512.maskable.png",
                    sizes: "512x512",
                    types: "image/png",
                    purposes: "maskable"
                }
            ]
        },
    },
    pluginOptions: {
        electronBuilder: {
            // List native deps here if they don't work
            externals: ['electron']
        }
    },
    devServer: {
        https: true,
        port: 8080,
        public: 'https://localhost:8080'
    }
}