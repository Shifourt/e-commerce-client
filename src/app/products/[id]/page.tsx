import Image from "next/image";
import type { Metadata } from "next";

// Keep it dynamic-friendly since we read searchParams
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Types kept local so there’s no external import to break deployment */
type Color = "gray" | "purple" | "green";
type Size = "xs" | "s" | "m" | "l" | "xl";

type Product = {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  sizes: Size[];
  colors: Color[];
  images: Record<Color, string>;
};

/** Stub product (replace with your fetch later if you want) */
const product: Product = {
  id: 1,
  name: "Adidas CoreFit T-Shirt",
  shortDescription:
    "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
  description:
    "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
  price: 59.9,
  sizes: ["xs", "s", "m", "l", "xl"],
  colors: ["gray", "purple", "green"],
  images: {
    gray: "/products/1g.png",
    purple: "/products/1p.png",
    green: "/products/1gr.png",
  },
};

/** Static metadata to avoid edge-cases in generateMetadata */
export const metadata: Metadata = {
  title: "Product",
  description: "Product details page",
};

type PageProps = {
  params: { id: string };
  searchParams?: { color?: string; size?: string };
};

export default function ProductPage({ params, searchParams }: PageProps) {
  const colorParam = (searchParams?.color ?? "") as Color;
  const sizeParam = (searchParams?.size ?? "") as Size;

  const selectedColor: Color = product.colors.includes(colorParam)
    ? colorParam
    : product.colors[0];

  const selectedSize: Size = product.sizes.includes(sizeParam)
    ? sizeParam
    : product.sizes[0];

  // Guaranteed to exist thanks to union typing + includes() check
  const imageSrc = product.images[selectedColor];

  // Build a relative URL that preserves/updates query params (no client JS needed)
  const buildUrl = (next: Partial<{ color: Color; size: Size }>) => {
    // URL requires a base, but we return a relative string
    const u = new URL(`/products/${params.id}`, "http://localhost");
    u.searchParams.set("color", next.color ?? selectedColor);
    u.searchParams.set("size", next.size ?? selectedSize);
    return `${u.pathname}?${u.searchParams.toString()}`;
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12">
      {/* IMAGE */}
      <div className="w-full lg:w-5/12 relative aspect-[2/3]">
        <Image
          src={imageSrc}
          alt={`${product.name} - ${selectedColor}`}
          fill
          priority
          className="object-contain rounded-md"
        />
      </div>

      {/* DETAILS */}
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <h2 className="text-2xl font-semibold">${product.price.toFixed(2)}</h2>

        {/* Size selector (server links) */}
        <div className="flex flex-wrap items-center gap-2">
          {product.sizes.map((s) => (
            <a
              key={s}
              href={buildUrl({ size: s })}
              className={`px-3 py-1 rounded-md border transition ${
                s === selectedSize
                  ? "bg-black text-white border-black"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {s.toUpperCase()}
            </a>
          ))}
        </div>

        {/* Color selector (server links) */}
        <div className="flex items-center gap-2">
          {product.colors.map((c) => (
            <a
              key={c}
              href={buildUrl({ color: c })}
              className={`px-3 py-1 rounded-md border transition capitalize ${
                c === selectedColor
                  ? "bg-black text-white border-black"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
              aria-label={`Select ${c}`}
            >
              {c}
            </a>
          ))}
        </div>

        {/* CARD INFO */}
        <div className="flex items-center gap-2 mt-4">
          <Image
            src="/klarna.png"
            alt="klarna"
            width={50}
            height={25}
            className="rounded-md"
          />
          <Image
            src="/cards.png"
            alt="cards"
            width={50}
            height={25}
            className="rounded-md"
          />
          <Image
            src="/stripe.png"
            alt="stripe"
            width={50}
            height={25}
            className="rounded-md"
          />
        </div>

        <p className="text-gray-500 text-xs">
          By clicking Pay Now, you agree to our{" "}
          <span className="underline hover:text-black">Terms & Conditions</span>{" "}
          and <span className="underline hover:text-black">Privacy Policy</span>
          . You authorize us to charge your selected payment method for the
          total amount shown. All sales are subject to our return and{" "}
          <span className="underline hover:text-black">Refund Policies</span>.
        </p>
      </div>
    </div>
  );
}
