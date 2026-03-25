// src/types/svg.d.ts
declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  
  // Для дефолтного экспорта (с exportType: 'default')
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
  
  // Также поддерживаем именованный экспорт на всякий случай
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;
}