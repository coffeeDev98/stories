import React from "react";
import useContainer from "./hooks/useContainer";

type Props = {};

const testData2 = [
  [
    {
      url: "https://static.pixical.com/videos/cooking/Alla%20Gricia/Alla%20Gricia%20-%20Cook%20Pasta%20-%20Landscape1.mp4",
      type: "video",
    },
    {
      url: "https://static.pixical.com/videos/cooking/Alla%20Gricia/Alla%20Gricia%20-%20Cook%20Pasta%20-%20Landscape7.mp4",
      type: "video",
    },
  ],
  [
    {
      url: "https://static.pixical.com/videos/cooking/Alla%20Gricia/Alla%20Gricia%20-%20Cook%20Pasta%20-%20Landscape2.mp4",
      type: "video",
    },
  ],
  [
    {
      url: "https://static.pixical.com/videos/cooking/Alla%20Gricia/Alla%20Gricia%20-%20Cook%20Pasta%20-%20Landscape3.mp4",
      type: "video",
    },
    {
      url: "https://static.pixical.com/videos/cooking/Alla+Gricia/Alla+Gricia+-+Cook+Pasta+-+Landscape6.mp4",
      type: "video",
    },
  ],
];
const testData = [
  [
    {
      id: "3075",
      url: "https://static.pixical.com/videos/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Cook%20the%20pasta%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Cook%20the%20pasta%20-%20Landscape1.jpg",
      duration: 5.372042,
      __typename: "Video",
    },
    {
      id: "3077",
      url: "https://static.pixical.com/videos/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Sweat%20aromatics%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Sweat%20aromatics%20-%20Landscape1.jpg",
      duration: 5.472133,
      __typename: "Video",
    },
  ],
  [
    {
      id: "3079",
      url: "https://static.pixical.com/videos/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Prepare%20the%20Flavored%20Cream%20Sauce%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Prepare%20the%20Flavored%20Cream%20Sauce%20-%20Landscape1.jpg",
      duration: 4.270937,
      __typename: "Video",
    },
  ],
  [
    {
      id: "3081",
      url: "https://static.pixical.com/videos/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Finish%20the%20Pasta%20in%20the%20Cream%20Sauce%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Finish%20the%20Pasta%20in%20the%20Cream%20Sauce%20-%20Landscape1.jpg",
      duration: 7.707708,
      __typename: "Video",
    },
    {
      id: "3083",
      url: "https://static.pixical.com/videos/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Add%20the%20Peas%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Add%20the%20Peas%20-%20Landscape1.jpg",
      duration: 3.8038,
      __typename: "Video",
    },
    {
      id: "3085",
      url: "https://static.pixical.com/videos/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Add%20the%20Cheeses%20and%20Herbs%20Off%20the%20Heat%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Add%20the%20Cheeses%20and%20Herbs%20Off%20the%20Heat%20-%20Landscape1.jpg",
      duration: 5.105104,
      __typename: "Video",
    },
  ],
  [
    {
      id: "3087",
      url: "https://static.pixical.com/videos/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Plate%20and%20Serve%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream/Farfalle%20with%20Prosciutto%2C%20Peas%2C%20and%20Cream%20-%20Plate%20and%20Serve%20-%20Landscape1.jpg",
      duration: 7.8078,
      __typename: "Video",
    },
  ],
];
const App = (props: Props) => {
  const { Content, contentProps, progressArray } = useContainer({
    stories: testData,
    loop: true,
    // isPaused: true,
  });
  return (
    <>
      {progressArray.map((p, i) => (
        <div key={i}>{p}</div>
      ))}

      <Content {...contentProps} />
    </>
  );
};

export default App;
