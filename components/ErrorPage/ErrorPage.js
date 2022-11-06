import React from "react";
import Head from "next/head";

const statusCodes = {
  400: "Bad Request",
  404: "This page could not be found",
  405: "Method Not Allowed",
  500: "Internal Server Error",
};

function _getInitialProps(props) {
  const { res, err } = props;

  const statusCode =
    res && res.statusCode ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
}

const styles = {
  error: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    height: "100vh",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  desc: {
    display: "inline-block",
    textAlign: "left",
    lineHeight: "49px",
    height: "49px",
    verticalAlign: "middle",
  },

  h1: {
    display: "inline-block",
    margin: 0,
    marginRight: "20px",
    padding: "0 23px 0 0",
    fontSize: "24px",
    fontWeight: 500,
    verticalAlign: "top",
    lineHeight: "49px",
  },

  h2: {
    fontSize: "14px",
    fontWeight: "normal",
    lineHeight: "49px",
    margin: 0,
    padding: 0,
  },
};

/**
 * `Error` component used for handling errors.
 */
export default class ErrorPage extends React.Component {
  static displayName = "ErrorPage";

  static getInitialProps = _getInitialProps;
  static origGetInitialProps = _getInitialProps;

  render() {
    const { statusCode } = this.props;
    const title =
      this.props.title ||
      statusCodes[statusCode] ||
      "An unexpected error has occurred";

    return (
      <div style={styles.error}>
        <Head>
          <title>
            {statusCode
              ? `${statusCode}: ${title}`
              : "Application error: a client-side exception has occurred"}
          </title>
        </Head>
        <div className="text-gray-900">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                body { margin: 0; color: #000; background: #fff; }
                .next-error-h1 {
                  border-right: 1px solid rgba(0, 0, 0, .3);
                }
                    : ""
                }`,
            }}
          />

          {statusCode ? (
            <h1 className="next-error-h1" style={styles.h1}>
              {statusCode}
            </h1>
          ) : null}
          <div style={styles.desc}>
            <h2 style={styles.h2}>
              {this.props.title || statusCode ? (
                title
              ) : (
                <>
                  Application error: a client-side exception has occurred (see
                  the browser console for more information)
                </>
              )}
              .
            </h2>
          </div>
        </div>
      </div>
    );
  }
}
