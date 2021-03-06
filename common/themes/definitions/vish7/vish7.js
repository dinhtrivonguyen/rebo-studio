
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
    viewName: ['EDiphy classic', 'EDiphy clásico'],
    font: 'Maven Pro',
    background: {
        f16_9: [
            '#3AB095',
        ],
        f4_3: [
            '#3AB095',
        ],
    },
    colors: {
        themeColor1: '#666666',
        themeColor2: '#454545',
        themeColor3: '#6f6f6f',
        themeColor4: '#999999',
        themeColor5: '#afafaf',
        themeColor6: '#FFFFFF',
        themeColor8: 'rgba(0,0,0,0)',
        themeColor9: '#454545',
        themeColor10: 'white',
        themeColor12: '#3AAF94', // Docs color background
        themeColor13: '#bfb6b6', // Not last element of breadcrumb
    },
    images: {
        template1: { left: 'left.jpg' },
        template3: { topLeft: 'vish.svg', topRight: 'vish.svg', bottomLeft: 'vish.svg', bottomRight: 'vish.svg' },
        template7: { left: 'vish.svg' },
    },
};
