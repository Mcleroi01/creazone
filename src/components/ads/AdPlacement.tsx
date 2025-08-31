import { AdSenseBanner } from './AdSenseBanner';

type AdPlacementProps = {
  type?: 'banner' | 'rectangle' | 'in-article' | 'in-feed';
  className?: string;
};

export const AdPlacement = ({ 
  type = 'banner',
  className = '' 
}: AdPlacementProps) => {
  const adConfigs = {
    banner: {
      slot: '1234567890', // Remplacez par votre ID de slot AdSense
      format: 'auto',
      layout: '',
      layoutKey: '',
      className: 'w-full my-8',
    },
    rectangle: {
      slot: '0987654321', // Remplacez par votre ID de slot AdSense
      format: 'auto',
      layout: '',
      layoutKey: '',
      className: 'my-8 mx-auto max-w-[300px]',
    },
    'in-article': {
      slot: '1122334455', // Remplacez par votre ID de slot AdSense
      format: 'fluid',
      layout: 'in-article',
      layoutKey: '',
      className: 'my-8',
    },
    'in-feed': {
      slot: '5566778899', // Remplacez par votre ID de slot AdSense
      format: 'fluid',
      layout: '',
      layoutKey: 'in-feed',
      className: 'my-8',
    },
  };

  const config = adConfigs[type] || adConfigs.banner;

  return (
    <div className={`ad-placement ${config.className} ${className}`}>
      <AdSenseBanner
        slot={config.slot}
        format={config.format}
        layout={config.layout}
        layoutKey={config.layoutKey}
      />
    </div>
  );
};

export default AdPlacement;
