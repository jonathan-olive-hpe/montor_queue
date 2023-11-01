import { response, request } from 'express';

export const getExample = (req = request, res = response) => {
    res.json({ message: 'example' });
}
