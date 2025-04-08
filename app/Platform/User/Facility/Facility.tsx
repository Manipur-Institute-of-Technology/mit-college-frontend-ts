import { Library_data } from "~/DB_Sample/FacilityData";

type commonProp = {
  name: string;
};

export default function ({ name }: commonProp) {
  const selectedFacility = Library_data.find(
    (item) => item.tittle.toLowerCase() === name.toLowerCase()
  );
  return (
    selectedFacility && (
      <>
        <div className="min-h-dvh">
          <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs">
            {name}
          </div>
          <div className="m-6">
            <div className="text-2xl tracking-wider mb-4">
              &emsp;&emsp;{selectedFacility?.heading}
            </div>
            <div className="mb-6">
              {selectedFacility?.images.map((image, index) => {
                return (
                  Object.values(image)[0] && (
                    <>
                      <img
                        src={Object.values(image)[0]}
                        alt={selectedFacility.heading}
                        key={index}
                      />
                    </>
                  )
                );
              })}
            </div>
            <div className="text-lg leading-9">
              {selectedFacility?.info.split("\n").map((line, index) => {
                return (
                  <p>
                    {line}
                    <br />
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </>
    )
  );
}
