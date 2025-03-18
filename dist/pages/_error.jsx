const Error = ({ statusCode }) => {
    return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '20px'
        }}>
      <h1>
        {statusCode
            ? `서버 오류가 발생했습니다: ${statusCode}`
            : '클라이언트 오류가 발생했습니다'}
      </h1>
      <p>잠시 후 다시 시도해주세요.</p>
    </div>);
};
Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};
export default Error;
