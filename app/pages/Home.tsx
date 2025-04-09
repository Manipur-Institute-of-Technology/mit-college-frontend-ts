import ImageCarousel from "../components/ImageCarousel/ImageCarrousel";

export default function Home() {
  return (
    <div className="relative">
      {/* {loaderData && (
				<Suspense fallback={<ImageCarouselSkeleton />}>
					<Await resolve={loaderData.data}>
						{(val) => (val.length > 0 ? <ImageCarousel data={val} /> : null)}
					</Await>
				</Suspense>
			)} */}
      <h1>This is Home</h1>
    </div>
  );
}
