import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodObject {
  id: number;
  name: string;
  description: string;
  price: string;
  avaliable: boolean;
  image: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodObject[]>([]);
  const [editingFood, setEditingFood] = useState<FoodObject>({} as FoodObject);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function componentDidMount() {
      const response = await api.get('/foods');
  
      setFoods(response.data);
    }
    componentDidMount();
  }, []);



  async function handleAddFood ( food: FoodObject ) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood ( food: FoodObject ) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood ( id: number ) {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    const changeModal = !modalOpen;

    setModalOpen(changeModal);
  }

  function toggleEditModal() {
    const changeEditModalOpen = !editModalOpen;

    setEditModalOpen(changeEditModalOpen);
  }

  function handleEditFood (food: FoodObject) {
    const changeEditingFood = food;
    const changeEditModalOpen = !editModalOpen;

    setEditingFood(changeEditingFood);
    setEditModalOpen(changeEditModalOpen);
  }

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
};

export default Dashboard;
