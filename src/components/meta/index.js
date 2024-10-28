import { Helmet } from "react-helmet";

function SeoMeta({ title, desc, url }) {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://www.famewheels.com/${url}`} />
      </Helmet>
    </div>
  );
}

export default SeoMeta;
