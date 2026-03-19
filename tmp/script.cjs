const fs = require('fs');

let svg = fs.readFileSync('c:/laragon/www/sistemaCartas/public/images/Estampilla-1.svg', 'utf8');

// The user's SVG used "#D7D2D1" fill
svg = svg.replace(/fill="white"/g, 'fill="#D7D2D1"');
svg = svg.replace(/clip-path/g, 'clipPath');
svg = svg.replace(/fill-opacity/g, 'fillOpacity');
svg = svg.replace(/fill-rule/g, 'fillRule');
svg = svg.replace(/clip-rule/g, 'clipRule');

// Turn into React component
svg = svg.replace('<svg ', '<svg className={className} ');

const component = `export function Estampilla1Icon({ className }: { className?: string }) {
  return (
    ${svg}
  );
}
`;

fs.mkdirSync('c:/laragon/www/sistemaCartas/resources/js/components/icons', { recursive: true });
fs.writeFileSync('c:/laragon/www/sistemaCartas/resources/js/components/icons/Estampilla1Icon.tsx', component);
console.log('Component created successfully.');
