import {useState} from "react";
import useRequest from "../../hooks/use-request";
import {useRouter} from "next/router";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [doRequest, errors] = useRequest({
        url: 'api/users/signup',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => router.push('/')
    });

    const onSubmit = async event => {
        event.preventDefault;

        await doRequest();
    }
    return (<form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
            <label>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="form-control"/>
        </div>
        <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                   className="form-control"/>
        </div>
        {errors}
        <button className="btn btn-primary">Sign Up</button>
    </form>);
};

export default Signup;