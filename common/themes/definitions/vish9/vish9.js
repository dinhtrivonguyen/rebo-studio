
export const DEFINITION = {
    /*
    * viewName: [<Nombre del tema en inglés>, <Nombre del tema es español>],
    * font: Fuente principal del tema (tiene que ser de Google Fonts),
    * background: [
    *   Insertar colores o url a las imágenes del tema. Por ejemplo: 'url(/themes/orange/background_images/orange0.jpg)',...
    * ],
    * colors: {
    *   themeColor1: color principal del tema,
    *   themeColor2:
    *   themeColor3:
    *   themeColor4:
    *   themeColor5:
    * },
    * images: {
    *   template1: { left: '' },
    *   template3: { topLeft: 'topLeft.png', topRight: 'topRight.png', bottomLeft: 'bottomLeft.png', bottomRight: 'bottomRight.png' },
    *   template7: { left: '' },
    * }
    * */
    viewName: ['ViSH 9', 'ViSH 9'],
    font: 'Maven Pro',
    background: {
        f16_9: [
            'vish9_169.jpeg',
        ],
        f4_3: [
            'vish9_43.jpeg',
        ],
    },
    colors: {
        themeColor1: '#666666',
        themeColor2: '#00CCA2',
        themeColor6: '#666666',
        themeColor8: 'rgba(0,0,0,0)',
        themeColor9: '#ffffff',
        themeColor10: '#ffffff',
        themeColor12: '#F29A2B', // Docs color background
        themeColor13: '#ffffff', // Not last element of breadcrumb
    },
    images: {
        template1: { left: 'left.jpg' },
        template3: { topLeft: 'vish.svg', topRight: 'vish.svg', bottomLeft: 'vish.svg', bottomRight: 'vish.svg' },
        template7: { left: 'vish.svg' },
    },
};
