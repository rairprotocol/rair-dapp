import { useCallback, useEffect, useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import useSwal from '../../hooks/useSwal';
import { loadCategories } from '../../redux/settingsSlice';
import { Category } from '../../types/databaseTypes';
import { rFetch } from '../../utils/rFetch';
import InputField from '../common/InputField';

const CategorySettings = () => {
  const dispatch = useAppDispatch();
  const { primaryButtonColor, textColor } = useAppSelector(
    (store) => store.colors
  );
  const reactSwal = useSwal();
  const [categoryListCopy, setCategoryListCopy] = useState<Array<Category>>([]);

  const setCategoryList = useCallback(async () => {
    const result = await rFetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({
        list: categoryListCopy.map((item) => ({
          _id: item._id,
          name: item.name
        }))
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (result.success) {
      reactSwal.fire('Success', 'Categories updated', 'success');
      dispatch(loadCategories());
    }
  }, [categoryListCopy, dispatch, reactSwal]);

  const { categories } = useAppSelector((store) => store.settings);

  useEffect(() => {
    setCategoryListCopy(categories);
  }, [categories]);

  const deleteCategory = useCallback(
    (index) => {
      const aux = [...categoryListCopy];
      aux.splice(index, 1);
      setCategoryListCopy(aux);
    },
    [categoryListCopy]
  );

  const updateCategory = useCallback(
    (index) => (value) => {
      const aux = [...categoryListCopy];
      aux[index] = {
        ...aux[index],
        name: value
      };
      setCategoryListCopy(aux);
    },
    [categoryListCopy]
  );

  return (
    <div className="col-12 px-5 my-2">
      <h3>Categories</h3>
      {categoryListCopy.map((categoryData, index) => {
        return (
          <div key={index} className="row">
            <div className="col-12 col-md-10">
              <InputField
                customClass="rounded-rair form-control"
                getter={categoryData.name}
                setter={updateCategory(index)}
                type="text"
              />
            </div>
            <button
              disabled={!!categoryData.files}
              onClick={() => deleteCategory(index)}
              className="col-12 col-md-2 btn btn-danger">
              {categoryData.files ? (
                <>
                  {categoryData.files} <small>files using this category</small>
                </>
              ) : (
                <FontAwesomeIcon icon={faTrash} />
              )}
            </button>
          </div>
        );
      })}
      <button
        className="float-start btn"
        style={{
          color: textColor,
          background: primaryButtonColor
        }}
        onClick={setCategoryList}>
        Set
      </button>
      <button
        className="btn btn-success float-end"
        onClick={() => {
          const aux = categoryListCopy ? [...categoryListCopy] : [];
          aux.push({
            name: '',
            files: 0
          });
          setCategoryListCopy(aux);
        }}>
        Add
      </button>
    </div>
  );
};

export default CategorySettings;
