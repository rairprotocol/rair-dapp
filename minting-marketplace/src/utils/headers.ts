const headers = () => ({
    'X-rair-token': `${localStorage.getItem('token')}`,
});

export { headers };