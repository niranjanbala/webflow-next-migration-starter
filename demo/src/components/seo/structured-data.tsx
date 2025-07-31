import { StructuredData } from '@/lib/seo';

interface StructuredDataProps {
  data: StructuredData | StructuredData[];
}

export default function StructuredDataComponent({ data }: StructuredDataProps) {
  const structuredDataArray = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {structuredDataArray.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item, null, 2)
          }}
        />
      ))}
    </>
  );
}