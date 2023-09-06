import React from "react";
import useContainer from "./hooks/useContainer";
import { Story } from "../interfaces";
import Progress from "./components/Progress/Progress";
import { isMobile } from "./utils";

type Props = {};
const landscapeVideos = [
  [
    {
      id: "3591",
      url: "https://static.pixical.com/videos/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Intro%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Intro%20-%20Landscape1.jpg",
      duration: 22.122104,
      __typename: "Video",
    },
    {
      id: "3593",
      url: "https://static.pixical.com/videos/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Ingredient%20categories%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Ingredient%20categories%20-%20Landscape1.jpg",
      duration: 27.027,
      __typename: "Video",
    },
  ],
  [
    {
      id: "3595",
      url: "https://static.pixical.com/videos/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Typical%20Ratios%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Typical%20Ratios%20-%20Landscape1.jpg",
      duration: 32.5325,
      __typename: "Video",
    },
  ],
  [
    {
      id: "3597",
      url: "https://static.pixical.com/videos/cooking/recipe-overview/Fast+Cooking+Tomato+Sauce+Based+Pastas/Fast+Cooking+Tomato+Sauce+Based+Pastas+-+Standard+Steps+-+Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Standard%20Steps%20-%20Landscape1.jpg",
      duration: 68.635233,
      __typename: "Video",
    },
    {
      id: "3599",
      url: "https://static.pixical.com/videos/cooking/recipe-overview/Fast+Cooking+Tomato+Sauce+Based+Pastas/Fast+Cooking+Tomato+Sauce+Based+Pastas+-+Visual+Cues+-+Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Visual%20Cues%20-%20Landscape1.jpg",
      duration: 53.486771,
      __typename: "Video",
    },
    {
      id: "3601",
      url: "https://static.pixical.com/videos/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Wrap%20-%20Landscape1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Wrap%20-%20Landscape1.jpg",
      duration: 13.880542,
      __typename: "Video",
    },
  ],
];

const portraitVideos = [
  [
    {
      id: "3592",
      url: "https://static.pixical.com/videos/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Intro%20-%20Portrait1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Intro%20-%20Portrait1.jpg",
      duration: 22.222208,
      __typename: "Video",
    },
  ],
  [
    {
      id: "3594",
      url: "https://static.pixical.com/videos/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Ingredient%20categories%20-%20Portrait1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Ingredient%20categories%20-%20Portrait1.jpg",
      duration: 27.027,
      __typename: "Video",
    },
    {
      id: "3600",
      url: "https://static.pixical.com/videos/cooking/recipe-overview/Fast+Cooking+Tomato+Sauce+Based+Pastas/Fast+Cooking+Tomato+Sauce+Based+Pastas+-+Visual+Cues+-+Portrait1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Visual%20Cues%20-%20Portrait1.jpg",
      duration: 53.486771,
      __typename: "Video",
    },
  ],
  [
    {
      id: "3602",
      url: "https://static.pixical.com/videos/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Wrap%20-%20Portrait1.mp4",
      thumbnailUrl:
        "https://static.pixical.com/thumbnails/cooking/recipe-overview/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas/Fast%20Cooking%20Tomato%20Sauce%20Based%20Pastas%20-%20Wrap%20-%20Portrait1.jpg",
      duration: 13.9139,
      __typename: "Video",
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
    stories: isMobile() ? portraitVideos : landscapeVideos,
    loop: true,
    // isPaused: true,
    // isFullscreen: true,
    styles: {},
  });
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          position: "absolute",
          top: 2,
          zIndex: 2,
        }}
      >
        {progressArray.map((p, i) => (
          <Progress key={i} width={1 / progressArray.length} count={p} />
        ))}
      </div>

      <Content {...contentProps} />
    </div>
  );
};

export default App;
