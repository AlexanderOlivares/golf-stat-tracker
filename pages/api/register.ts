import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest,res: NextApiResponse){
    const { username, email, password } = req.body;
    try {
      console.log(req.body);
      res.status(200).send({message: "success"})
    } catch (error) {
      console.log(error); 
      res.status(500).send({message: "error"})
    }
}