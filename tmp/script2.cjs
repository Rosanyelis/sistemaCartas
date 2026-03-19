const fs = require('fs');

let svg = fs.readFileSync('c:/laragon/www/sistemaCartas/public/images/Estampilla-2.svg', 'utf8');

// Use "#D7D2D1" fill
svg = svg.replace(/fill="[A-Za-z0-9#]+"/g, 'fill="#D7D2D1"');
svg = svg.replace(/clip-path/g, 'clipPath');
svg = svg.replace(/fill-opacity/g, 'fillOpacity');
svg = svg.replace(/fill-rule/g, 'fillRule');
svg = svg.replace(/clip-rule/g, 'clipRule');

// Turn into React component
svg = svg.replace('<svg ', '<svg className={className} ');

const component = `export function Estampilla2Icon({ className }: { className?: string }) {
  return (
    ${svg}
  );
}
`;

fs.mkdirSync('c:/laragon/www/sistemaCartas/resources/js/components/icons', { recursive: true });
fs.writeFileSync('c:/laragon/www/sistemaCartas/resources/js/components/icons/Estampilla2Icon.tsx', component);
console.log('Component Estampilla2Icon created successfully.');
