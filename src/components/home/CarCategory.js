import CategorySlider from "./CategorySlider";

const CarCategory = () => {
  return (
    <>
      <div className=" container">
        <div className="mt-3">
          <h2 className="text-center section-titles font-lato ">
            Browse Used{" "}
            <span className="color-secondary">Cars by Category</span>
          </h2>

          <CategorySlider />
        </div>
      </div>
    </>
  );
};

export default CarCategory;