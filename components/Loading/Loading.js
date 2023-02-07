// import ReactLoading from "react-loading";

// const Loading = ({ withWrapper, height, width, type = "bars" }) => {
//   if (withWrapper) {
//     return (
//       <div className="w-full h-full flex items-center justify-center">
//         <ReactLoading type={type} color="black" width={width} height={height} />
//       </div>
//     );
//   }

//   return (
//     <ReactLoading type={type} color="black" width={width} height={height} />
//   );
// };

const Loading = ({ withWrapper }) => {
  if (withWrapper) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>Loading...</>;
};

export default Loading;
