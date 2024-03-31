// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, {useEffect, useState} from "react";

const URL = "https://jsonplaceholder.typicode.com/users";

type Company = {
    bs: string;
    catchPhrase: string;
    name: string;
};

type User = {
    id: number;
    email: string;
    name: string;
    phone: string;
    username: string;
    website: string;
    company: Company;
    address: any;
};

interface IButtonProps {
    onClick: () => void;
}

const Button = React.memo(({ onClick }: IButtonProps): JSX.Element => {
    return (
        <button type="button" onClick={onClick}>
            get random user
        </button>
    );
});

interface IUserInfoProps {
    user: User | null;
}

const UserInfo = React.memo(({ user }: IUserInfoProps): JSX.Element | null => {
    if (!user) return null;
    return (
        <table>
            <thead>
            <tr>
                <th>Username</th>
                <th>Phone number</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{user.name}</td>
                <td>{user.phone}</td>
            </tr>
            </tbody>
        </table>
    );
});

function useThrottle(callback: () => void, delay: number) {
    const [throttled, setThrottled] = useState(false);

    useEffect(() => {
        if (!throttled) {
            const timer = setTimeout(() => {
                setThrottled(false);
            }, delay);

            setThrottled(true);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [callback, delay, throttled]);

    return throttled;
}

export default function Steels() {
    const [user, setUser] = useState<User | null>(null);
    const isThrottled = useThrottle(receiveRandomUser, 1000);

    async function receiveRandomUser() {
        const id = Math.floor(Math.random() * 10) + 1;
        const response = await fetch(`${URL}/${id}`);
        const _user = (await response.json()) as User;
        setUser(_user);
    }

    const handleButtonClick = () => {
        if (!isThrottled) {
            receiveRandomUser();
        }
    };

    return (
        <div>
            <header>Get a random user</header>
            <Button onClick={handleButtonClick} />
            <UserInfo user={user} />
        </div>
    );
}
